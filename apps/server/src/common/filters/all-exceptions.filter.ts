import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

type ErrorBody = {
  statusCode: number;
  path: string;
  timestamp: string;
  message: unknown;
  /** 머신리더블 사유 코드(예외 payload에 code가 있을 때만). 클라이언트 분기용. */
  code?: string;
};

/**
 * 모든 미처리 예외를 일관된 JSON 형태로 변환한다.
 * 5xx는 스택과 함께 로깅하고, 클라이언트에는 내부 정보를 노출하지 않는다.
 *
 * 전역 등록: `main.ts`의 `app.useGlobalFilters(new AllExceptionsFilter())`.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message, code } = this.extract(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ErrorBody = {
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      message,
      ...(code ? { code } : {}),
    };
    response.status(status).json(body);
  }

  /**
   * 예외에서 사용자 메시지와 사유 코드를 추출한다.
   * - `new HttpException('msg', status)` → message 문자열
   * - `new XxxException('msg')`(빌트인) → getResponse()가 { message, error, statusCode } 객체 → message만 뽑음
   * - `new XxxException({ code, message })` → 사유 코드와 메시지를 함께 노출
   */
  private extract(exception: unknown): { message: unknown; code?: string } {
    if (!(exception instanceof HttpException)) {
      return { message: '내부 서버 오류가 발생했습니다.' };
    }
    const res = exception.getResponse();
    if (typeof res === 'string') {
      return { message: res };
    }
    if (res && typeof res === 'object') {
      const obj = res as Record<string, unknown>;
      const nestedMessage =
        obj.message && typeof obj.message === 'object'
          ? (obj.message as Record<string, unknown>)
          : null;
      const code =
        typeof obj.code === 'string'
          ? obj.code
          : typeof nestedMessage?.code === 'string'
            ? nestedMessage.code
            : undefined;
      const message =
        typeof nestedMessage?.message === 'string'
          ? nestedMessage.message
          : 'message' in obj
            ? obj.message
            : res;
      return { message, code };
    }
    return { message: '요청을 처리할 수 없습니다.' };
  }
}

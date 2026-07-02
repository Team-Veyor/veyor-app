import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { Public } from './public.decorator';

type AuthClientLogPayload = {
  stage?: unknown;
  provider?: unknown;
  name?: unknown;
  message?: unknown;
  status?: unknown;
  errorCode?: unknown;
  urlError?: unknown;
  urlErrorCode?: unknown;
  urlErrorDescription?: unknown;
  path?: unknown;
  userAgent?: unknown;
};

const AUTH_LOG_STAGES = new Set([
  'oauth_start',
  'oauth_redirect',
  'exchange_code',
  'missing_session',
  'fetch_user',
  'unknown',
]);

const clip = (value: unknown, maxLength: number): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  return value.slice(0, maxLength);
};

const normalizeStage = (stage: unknown) => {
  const value = clip(stage, 40);
  return value && AUTH_LOG_STAGES.has(value) ? value : 'unknown';
};

@Controller('auth')
export class AuthClientLogController {
  private readonly logger = new Logger(AuthClientLogController.name);

  @Public()
  @Post('client-error')
  @HttpCode(204)
  logClientError(@Body() body: AuthClientLogPayload) {
    const event = {
      event: 'auth_client_error',
      stage: normalizeStage(body.stage),
      provider: clip(body.provider, 40) ?? 'unknown',
      name: clip(body.name, 120),
      message: clip(body.message, 500),
      status: typeof body.status === 'number' ? body.status : clip(body.status, 40),
      errorCode: clip(body.errorCode, 120),
      urlError: clip(body.urlError, 120),
      urlErrorCode: clip(body.urlErrorCode, 120),
      urlErrorDescription: clip(body.urlErrorDescription, 500),
      path: clip(body.path, 200),
      userAgent: clip(body.userAgent, 300),
    };

    this.logger.warn(JSON.stringify(event));
  }
}

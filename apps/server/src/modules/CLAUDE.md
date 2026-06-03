# modules/ — 도메인 피처 모듈

실제 비즈니스 기능이 사는 곳입니다. **도메인 1개 = 폴더 1개**, 그 안에 필요한 모든 것을 담는 자기완결 단위입니다.

## 모듈 폴더 표준 레이아웃

```
modules/<domain>/
├── <domain>.module.ts        # 모듈 정의 (providers·controllers·exports)
├── <domain>.controller.ts    # 라우팅·DTO 검증·직렬화 (로직 X)
├── <domain>.service.ts       # 비즈니스 로직
├── <domain>.repository.ts    # supabase-js 쿼리 캡슐화
├── dto/                      # 요청/응답 DTO (create-*.dto.ts, update-*.dto.ts)
├── entities/ (또는 types.ts) # 도메인 모델·타입
└── <domain>.service.spec.ts  # 테스트 (선택)
```

## 책임 분리
- **Controller**: HTTP 입출력만. DTO로 검증, 결과 직렬화. 비즈니스 로직 두지 않음.
- **Service**: 도메인 규칙. 다른 도메인이 필요하면 그 모듈의 **Service를 주입**(Repository 직접 접근 X).
- **Repository**: `core/supabase`의 클라이언트로 테이블 접근을 캡슐화. Service는 supabase-js를 직접 부르지 않음.

## 새 모듈 추가 절차
1. `modules/<domain>/` 생성, 위 레이아웃대로 파일 작성.
2. `<domain>.module.ts`에 `controllers`/`providers` 등록. 다른 모듈에 노출할 Service는 `exports`.
3. `app.module.ts`의 `imports`에 `<Domain>Module` 추가.
4. client와 공유할 요청/응답 타입은 `packages/shared`에 정의.
5. `pnpm --filter @veyor/server typecheck` & `pnpm check`로 검증.

## 모듈 설계 규칙
- **엔티티마다 모듈을 쪼개지 말 것** — 순환 의존을 유발. 응집된 도메인 경계로 묶는다.
- 모듈 간 결합은 최소화. 공유가 필요하면 명시적 `exports`/`imports`로만 연결.
- 의존 방향: `modules → core/common` (역방향 금지). 모듈끼리는 꼭 필요할 때만.
- 네이밍: 파일 `<name>.<role>.ts`, DTO `<action>-<entity>.dto.ts`.

> 도메인 예시(확정 시 채움): `user`, `vote`(의견 모으기), `reward`(참여 보상) 등.

# 카카오톡 소셜 로그인 설정 가이드

## 1. Kakao Developers 설정

1. [Kakao Developers](https://developers.kakao.com/)에 접속하여 로그인합니다.
2. **내 애플리케이션** > **애플리케이션 추가하기**를 클릭하여 새 앱을 생성합니다.
3. 생성된 앱을 선택하고 **요약 정보**에서 **REST API 키**를 복사해둡니다. (Supabase 설정 시 필요)
4. **플랫폼** 메뉴로 이동하여 **Web 플랫폼 등록**을 클릭합니다.
   - 사이트 도메인에 `http://localhost:3000` (개발 환경)과 배포 주소를 입력합니다.
5. **카카오 로그인** 메뉴로 이동하여 상태를 **ON**으로 변경합니다.
6. **Redirect URI** 등록 버튼을 클릭하고 다음 주소를 추가합니다:
   - `https://<YOUR_PROJECT_ID>.supabase.co/auth/v1/callback`
   - (Supabase 대시보드의 Authentication > Providers > Kakao 설정 화면에서 정확한 Redirect URL을 확인할 수 있습니다.)
7. **동의항목** 메뉴에서 필요한 정보(닉네임, 프로필 사진, 이메일 등)를 설정합니다.
8. (선택 사항) **보안** 메뉴에서 Client Secret을 생성하고 복사해둡니다.

## 2. Supabase 설정

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속하여 프로젝트를 선택합니다.
2. **Authentication** > **Providers**로 이동합니다.
3. **Kakao**를 찾아 클릭하여 설정을 엽니다.
4. **Kakao Enabled**를 활성화합니다.
5. **REST API Key**에 Kakao Developers에서 복사한 키를 입력합니다.
6. **Client Secret Code**에 Kakao Developers에서 생성한 Secret 코드를 입력합니다. (설정한 경우)
7. **Save**를 클릭하여 저장합니다.

## 3. 환경 변수 설정

1. 프로젝트 루트의 `.env.local.example` 파일을 복사하여 `.env.local` 파일을 생성합니다.
2. Supabase 대시보드의 **Settings** > **API**에서 URL과 Publishable Key를 확인합니다.
   - (기존의 `anon` 키와 동일한 역할을 하지만, 최신 명칭인 `Publishable Key`를 사용합니다.)
3. `.env.local` 파일에 해당 값을 입력합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## 4. 실행

```bash
npm run dev
```

이제 메인 페이지의 "로그인" 버튼이나 "1분 만에 시작하기" 버튼을 클릭하면 카카오 로그인 페이지로 이동합니다.

## 5. 인증 업로드(검토) 기능 설정

1. Supabase에서 업로드 파일을 저장할 Storage `submissions` 버킷을 생성하세요.

   - Dashboard > Storage > Buckets > Create bucket
   - ID에 `submissions` 입력, 공개 여부는 필요에 따라 결정하세요 (권장: 비공개)

2. 데이터베이스에 검토용 테이블과 RLS 정책을 적용하세요.

   - `supabase/create_verifications.sql` 파일의 내용을 Supabase SQL Editor에 붙여넣고 실행하세요.
   - 이 SQL은 `verifications` 테이블을 생성하고, 사용자가 자신의 업로드만 삽입/조회할 수 있도록 RLS를 설정합니다. (관리자는 서비스 키로 접근해 전체 데이터를 확인하세요.)

3. 프론트엔드에서 업로드 페이지는 `/verify` 경로에 있습니다. 로그인된 사용자는 여기에서 이미지를 업로드하면 Supabase Storage에 저장되고 `verifications` 테이블에 기록됩니다.

4. 검토 완료 시 알림톡 발송은 서버(관리자)에서 처리하시면 됩니다. 업로드가 성공하면 사용자는 "업로드 성공: 검토 후 알림톡이 발송됩니다." 메시지를 보게 됩니다.

# 본문 추출

## Decisions

- 웹 페이지 본문 추출은 defuddle로 하고, 결과는 Markdown으로 받습니다(`Defuddle(document, url, { markdown: true })`).
- defuddle은 HTML을 직접 가져오지 않습니다. 앱 서버가 페이지 HTML을 가져와 linkedom으로 DOM을 만든 뒤 `defuddle/node`에 넘깁니다.
- 로그인이 필요하거나 JavaScript로만 본문을 그리는 페이지는 지원하지 않습니다. 이런 페이지는 "본문 없음" 또는 "가져오기 실패"로 안내합니다.

## Why

defuddle은 사용자가 필수로 지정한 라이브러리입니다. 받은 HTML만 다루므로 브라우저 렌더링이 필요한 페이지까지 지원하려면 헤드리스 브라우저 같은 별도 구성이 필요한데, 요청 범위 밖입니다.

## Boundaries

- 요청 제한, SSRF 방어 같은 보안 하드닝은 프로젝트 검증 예산(AGENTS.md)에 따라 범위 밖입니다.

import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // 自アプリAPI以外には認証ヘッダーを付けない
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  // ブラウザ環境でのみトークンを取得
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('authToken');

    if (token) {
      const normalizedToken = token.replace(/^Bearer\s+/i, '').trim();

      // トークンがある場合、Authorizationヘッダーを追加
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${normalizedToken}`,
        },
      });
      return next(clonedRequest);
    }
  }

  return next(req);
};

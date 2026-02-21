import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // ブラウザ環境でのみトークンを取得
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('authToken');

    if (token) {
      // トークンがある場合、Authorizationヘッダーを追加
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(clonedRequest);
    }
  }

  return next(req);
};

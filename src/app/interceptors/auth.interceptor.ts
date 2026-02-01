import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  // ブラウザ環境でのみトークンを取得
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('authToken');
    console.log('AuthInterceptor: トークン確認:', token ? 'あり' : 'なし');
    
    if (token) {
      // トークンがある場合、Authorizationヘッダーを追加
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('AuthInterceptor: 認証ヘッダーを付与');
      return next(clonedRequest);
    } else {
      console.log('AuthInterceptor: トークンがないため認証ヘッダーを付与できません');
    }
  }
  
  return next(req);
};

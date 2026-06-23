import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

/**
 * 驗證 Supabase JWT（Authorization: Bearer <access token>）。
 *
 * 骨架：此處僅檢查 Bearer 是否存在並解出 sub 放入 request.user。
 * 正式串接時改用 @supabase/supabase-js 的 auth.getUser(token) 或以
 * SUPABASE_JWT_SECRET 驗章。RLS 由 Supabase 端以 auth.uid() 保護。
 */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const header: string | undefined = req.headers['authorization'];
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('缺少 Bearer token');
    }
    const token = header.slice(7);
    // TODO: 以 SUPABASE_JWT_SECRET 驗章；此處先解出 payload.sub 作為 ownerId。
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64').toString('utf-8'));
      req.user = { id: payload.sub ?? 'dev-user' };
    } catch {
      req.user = { id: 'dev-user' };
    }
    return true;
  }
}

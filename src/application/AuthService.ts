import type { AuthClaims, AuthToken, IAuthService } from "./ports/IAuthService";
import type {
  ExternalProviderName,
  IExternalAuthProviderFactory,
} from "./ports/IExternalAuthProviderFactory";
import type { IJwtSigner } from "./ports/IJwtSigner";
import type { IUserRepository } from "./ports/IUserRepository";
import { ExternalAuthError } from "./errors/ExternalAuthError";

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtSigner: IJwtSigner,
    private readonly externalProviderFactory: IExternalAuthProviderFactory
  ) {}

  async login(username: string, password: string): Promise<AuthToken | null> {
    const user = await this.userRepository.findByCredentials(
      username,
      password
    );

    if (!user) {
      return null;
    }

    return this.generateToken(user);
  }

  private generateToken(user: {
    id: number;
    name: string;
    email: string;
    role: string;
  }): AuthToken {
    const payload: AuthClaims = {
      sub: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role as any,
    };

    return { token: this.jwtSigner.sign(payload) };
  }

  verifyToken(token: string): AuthClaims {
    return this.jwtSigner.verify(token);
  }

  async externalLogin(
    provider: string,
    code: string,
    state?: string
  ): Promise<AuthToken> {
    const providerKey = provider.toLowerCase() as ExternalProviderName;
    const externalProvider =
      this.externalProviderFactory.getProvider(providerKey);
    if (!externalProvider) {
      throw new ExternalAuthError("INVALID_PROVIDER");
    }

    const profile = await externalProvider.exchangeCodeForProfile(code, state);
    let user = await this.userRepository.findByEmail(profile.email);
    if (!user) {
      user = await this.userRepository.createExternalUser(
        profile.name,
        profile.email,
        "user"
      );
    }

    return this.generateToken(user);
  }
}

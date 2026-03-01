import { BaseService } from './base';
import {
  getUsers,
  addUser,
  getCurrentUser,
} from '../sdk.gen';
import {
  UserDtoSchema,
  type UserDto,
  type UserCreationDto,
} from '../validation/schemas';

/**
 * Service for managing users in Komga.
 * Provides methods to list, create, and retrieve users.
 */
export class UserService extends BaseService {
  /**
   * Get all users.
   * @returns Array of user DTOs
   * @throws ValidationError if response validation fails
   * @throws ApiError if API error occurs
   */
  async getAll(): Promise<UserDto[]> {
    return this.safeCall(
      () => getUsers({ client: this.client }),
      UserDtoSchema.array()
    );
  }

  /**
   * Get the currently authenticated user.
   * @returns Current user DTO
   * @throws ValidationError if response validation fails
   * @throws ApiError if API error occurs
   */
  async getCurrent(): Promise<UserDto> {
    return this.safeCall(
      () => getCurrentUser({ client: this.client }),
      UserDtoSchema
    );
  }

  /**
   * Create a new user.
   * @param data - User creation data
   * @returns Created user DTO
   * @throws ValidationError if response validation fails
   * @throws ApiError if API error occurs
   */
  async create(data: UserCreationDto): Promise<UserDto> {
    return this.safeCall(
      () => addUser({ client: this.client, body: data }),
      UserDtoSchema
    );
  }
}

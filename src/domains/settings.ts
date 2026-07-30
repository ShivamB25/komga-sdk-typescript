import { BaseService } from './base';
import {
  getServerSettings,
  updateServerSettings,
} from '../sdk.gen';
import {
  SettingsDtoSchema,
  type SettingsDto,
  type SettingsUpdateDto,
} from '../validation/schemas';

/**
 * Service for managing server settings in Komga.
 * Provides methods to get and update server configuration.
 */
export class SettingsService extends BaseService {
  /**
   * Get current server settings.
   * @returns Server settings DTO
   * @throws ValidationError if response validation fails
   * @throws ApiError if API error occurs
   */
  async get(): Promise<SettingsDto> {
    return this.safeCall(
      () => getServerSettings({ client: this.client }),
      SettingsDtoSchema
    );
  }

  /**
   * Update server settings.
   * @param data - Settings update data
   * @throws ApiError if API error occurs
   */
  async update(data: SettingsUpdateDto): Promise<void> {
    await this.safeVoidCall(() =>
      updateServerSettings({ client: this.client, body: data })
    );
  }
}

import { createAddressService } from './addressService.js'
import { createAdminService } from './adminService.js'
import { createPasswordService } from './passwordService.js'
import { createProfileService } from './profileService.js'
import { createRegistrationService } from './registrationService.js'
import { createSessionService } from './sessionService.js'

export function createServices(repositories) {
  return {
    registration: createRegistrationService(repositories),
    session: createSessionService(repositories),
    passwords: createPasswordService(repositories),
    profile: createProfileService(repositories),
    addresses: createAddressService(repositories),
    admin: createAdminService(repositories),
  }
}

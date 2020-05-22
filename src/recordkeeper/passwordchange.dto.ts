import { IsEmail, IsNotEmpty, IsDate, IsBoolean} from 'class-validator'

export class PasswordChangeDto {

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsDate()
  dateRequested: Date

  dateCompleted: Date

  @IsBoolean()
  completed: boolean

  ip: string
  device: string
  completedIp: string
  completedDevice: string

  constructor(email, dateRequested, dateCompleted, completed, ip, device, completedIp, completedDevice) {
    this.email = email
    this.dateRequested = dateRequested
    this.dateCompleted = dateCompleted
    this.completed = completed
    this.ip = ip
    this.device = device
    this.completedIp = completedIp
    this.completedDevice = completedDevice
  }

}
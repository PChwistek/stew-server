import { IsEmail, IsNotEmpty, IsDate, IsBoolean} from 'class-validator'

export class OrgInviteDto {

  @IsNotEmpty()
  orgId: string

  @IsNotEmpty()
  adminId: string

  @IsEmail()
  @IsNotEmpty()
  memberEmail: string

  @IsDate()
  dateRequested: Date

  dateCompleted: Date

  @IsBoolean()
  completed: boolean

  memberId: string

  constructor(orgId, adminId, memberEmail, memberId, dateRequested, dateCompleted, completed) {
    this.orgId = orgId
    this.adminId = adminId
    this.memberEmail = memberEmail
    this.memberId = memberId
    this.dateRequested = dateRequested
    this.dateCompleted = dateCompleted
    this.completed = completed
  }

}
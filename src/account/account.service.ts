import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Account } from './account.interface'
import { AccountDto } from './account.dto'
import { AccountPayloadDto } from './account-payload.dto'
import axios from 'axios'
import { OAuthPayloadDto } from './oauth-payload.dto'

@Injectable()
export class AccountService {
  constructor(@InjectModel('Account') private readonly accountModel: Model<Account>) {}

  async create(accountPayloadDto: AccountPayloadDto, passwordHash: string): Promise<Account> {
    const fullAccount = new AccountDto(accountPayloadDto.email, passwordHash, '', [''])
    const createdAccount = new this.accountModel(fullAccount)
    await createdAccount.save()

    if (accountPayloadDto.newsletter) {
      try {
        await axios.post('https://us4.api.mailchimp.com/3.0/lists/c65f16bba9/members/', { 
          email_address: accountPayloadDto.email,
          status: 'subscribed',
        },
        {
          auth: {
            username: 'phil',
            password: '8d52e8b330c95ecac1e8218aaca81b0b-us4',
          },
        })
      } catch(error) {
        console.log('error', error)
      }
    }

    return createdAccount
  }

  async createAccountFromOAuth(payload: OAuthPayloadDto) {
    const fullAccount = new AccountDto(payload.email, '', '', [''])
    fullAccount.createGoogleAccount()
    const createdAccount = new this.accountModel(fullAccount)
    await createdAccount.save()

    if (payload.newsletter) {
      try {
        await axios.post('https://us4.api.mailchimp.com/3.0/lists/c65f16bba9/members/', { 
          email_address: payload.email,
          status: 'subscribed',
        },
        {
          auth: {
            username: 'phil',
            password: '8d52e8b330c95ecac1e8218aaca81b0b-us4',
          },
        })
      } catch(error) {
        console.log('error', error)
      }
    }

    return createdAccount
  }

  async addProfile(_id: string, displayName: string): Promise<Account> {
    return await this.accountModel.findOneAndUpdate({ _id }, { username: displayName }, { returnOriginal: false})
  }

  async findAll(): Promise<Account[]> {
    return await this.accountModel.find().exec()
  }

  async setUpdatedTime(_id: string): Promise<Account> {
    return await this.accountModel.findOneAndUpdate({ _id }, { lastUpdated: new Date() }, { returnOriginal: false })
  }

  async setFavorite(_id: string, recipeId: string, isNew: boolean): Promise<Account> {
    const user = await this.accountModel.findOne({ _id })
    const { favoriteRecipes } = user

    const index = favoriteRecipes.findIndex(fav => fav === recipeId)
    if (isNew) {
      if (index === -1) {
        favoriteRecipes.push(recipeId)
      }
    } else {
      if (index > -1) {
        favoriteRecipes.splice(index, 1)
      }
    }
    return await this.accountModel.findOneAndUpdate({ _id }, { favoriteRecipes }, { returnOriginal: false})
  }

  async setImported(userId: string, shareableRecipeId: string, adding: boolean): Promise<Account> {
    const user = await this.accountModel.findOne({ _id: userId })
    const { importedRecipes } = user

    const index = importedRecipes.findIndex(toAdd => toAdd === shareableRecipeId)
    if (adding) {
      if (index === -1) {
        importedRecipes.push(shareableRecipeId)
      } else {
      }
    } else {
      if (index > -1) {
        importedRecipes.splice(index, 1)
      }
    }
    return await this.accountModel.findOneAndUpdate({ _id: userId }, { importedRecipes }, { returnOriginal: false })
  }

  async setNewPassword(_id: string, newPasswordHash: string) {
    await this.accountModel.findOneAndUpdate({ _id }, { passwordHash: newPasswordHash }, { returnOriginal: false })
    return true
  }

  async findOneById(_id: string): Promise<Account> {
    try {
      return await this.accountModel.findOne({ _id }).exec()
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async findOneByEmail(email: string): Promise<Account> {
    try {
      return await this.accountModel.findOne({ email }).exec()
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async setOrgs(_id: string, orgId: string, isNew: boolean): Promise<Account> {
    const user = await this.accountModel.findOne({ _id })
    let { orgs } = user

    if (orgs.typeof === 'null' || orgs.typeof === 'undefined') orgs = []

    const index = orgs.findIndex(id => id === orgId)
    if (isNew) {
      if (index === -1) {
        orgs.push(orgId)
      }
    } else {
      if (index > -1) {
        orgs.splice(index, 1)
      }
    }
    return await this.accountModel.findOneAndUpdate({ _id }, { orgs }, { returnOriginal: false})
  }

}

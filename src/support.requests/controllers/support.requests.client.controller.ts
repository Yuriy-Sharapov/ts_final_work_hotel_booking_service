import {
    Controller,
    UseGuards,
    SetMetadata,
    Post,
    Body,
    Get,
    Query,
    Request,
  } from '@nestjs/common';
import { SupportRequestsClientService } from "../services/support.requests.client.service";
import { Role } from 'src/types';
import { AuthGuard } from 'src/auth/auth.guard';
import { ICreateSupportRequestDto } from '../interfaces/create.support.request.dto';
import { ISupportRequestClientAnswer } from '../interfaces/support.request.client.answer';
import { ISearchSupportRequestParams } from '../interfaces/search.support.request.params';
import { SupportRequestsService } from '../services/support.requests.service';
import { IParamMessageText } from '../interfaces/IParamMessageText';
import { userInfo } from 'os';
import { IParamUser } from 'src/users/interfaces/IParamUser';

@Controller('/api/client/support-requests/')
@SetMetadata('roles', [Role.client])    // Запускать методы текущего класса может только Client
@UseGuards(AuthGuard)                   // Профиль пользователя под защитой JWT-токена
export class SupportRequestClientController {
    constructor(
        private readonly supportRequestsClientService: SupportRequestsClientService,
        private readonly supportRequestsService: SupportRequestsService
    ){}

    // 2.5.1 Позволяет пользователю с ролью client создать обращение в техподдержку

    @Post()
    async createSupportRequest(
        @Request() { user }: IParamUser,
        @Body() body: IParamMessageText
    ): Promise<ISupportRequestClientAnswer> {
        //u
        let createupportRequestDto: ICreateSupportRequestDto
        createupportRequestDto.userId = user.id
        createupportRequestDto.text   = body.text

        // Создаем новый запрос к поддержке
        let supportRequest = await this.supportRequestsClientService.createSupportRequest(createupportRequestDto)

        // Создаем ответ для фронденда
        let supportRequestClientAnswer: ISupportRequestClientAnswer
        supportRequestClientAnswer.id        = supportRequest.id
        supportRequestClientAnswer.createdAt = supportRequest.createdAt
        supportRequestClientAnswer.isActive  = supportRequest.isActive

        // Определяем, есть ли непрочитанные сообщений
        if (await this.supportRequestsClientService.getUnreadCount(supportRequest.id) > 0) {
            supportRequestClientAnswer.hasNewMessages = true
        }
        else {
            supportRequestClientAnswer.hasNewMessages = false
        }

        return supportRequestClientAnswer
    }

    // 2.5.2 Позволяет пользователю с ролью client получить список обращений для текущего пользователя.

    @Get()
    async getSupportRequests(@Query() params: ISearchSupportRequestParams): Promise<ISupportRequestClientAnswer[]> {
        
        // Получаем список запросов к поддержке
        const supportRequests = await this.supportRequestsService.findSupportRequests(params)
        
        // Создаем ответ для фронденда
        let supportRequestClientAnswers: ISupportRequestClientAnswer[]

        // Пробегаем по списку запросов к поддержке и заполняем соответствующие ответы пользователю
        for (let i = 0; i < supportRequests.length; i++){
            
            let supportRequest = supportRequests[i]
            let supportRequestClientAnswer: ISupportRequestClientAnswer
            supportRequestClientAnswer.id        = supportRequest.id
            supportRequestClientAnswer.createdAt = supportRequest.createdAt
            supportRequestClientAnswer.isActive  = supportRequest.isActive
    
            // Определяем, есть ли непрочитанные сообщений
            if (await this.supportRequestsClientService.getUnreadCount(supportRequest.id) > 0) {
                supportRequestClientAnswer.hasNewMessages = true
            }
            else {
                supportRequestClientAnswer.hasNewMessages = false
            }    
            supportRequestClientAnswers.push(supportRequestClientAnswer)
        }

        return supportRequestClientAnswers
    }
}
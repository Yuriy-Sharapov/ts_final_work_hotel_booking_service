// Payload (полезная нагрузка) для JWT токена

export interface IJwtPayload{
    id       : string, // id пользователя
    email    : string, // email пользователя
    firstName: string  // firstName пользователя
}
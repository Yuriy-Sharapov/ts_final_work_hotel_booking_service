// Payload (полезная нагрузка) для JWT токена

export interface IJwtPayload {
  id: string; // id пользователя
  email: string; // email пользователя
  name: string; // name пользователя
  contactPhone: string; // контактный телефон пользователя
}

export enum UserRole {
  ADMIN = 'admin', // access any thing 
  USER = 'user',  // only access public routes
  MANAGER = 'manager', // access any thing exept add and delete product 
}

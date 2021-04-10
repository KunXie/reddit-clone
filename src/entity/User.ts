import { IsEmail, Length } from "class-validator";
import { Entity as TOEntity, Column, BeforeInsert, OneToMany } from "typeorm";
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

import Entity from "./Entity";
import Post from "./Post";
@TOEntity("users")
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @IsEmail(undefined, { message: "Must be a valid email address" })
  @Length(1, 255, { message: "Email is empty" })
  @Column({ unique: true })
  email: string;

  // @Index()
  @Length(3, 255, { message: "must be at least 3 characters long" })
  @Column({ unique: true }) // 这里的unique会让数据库mysql自动创建index, 所以就不需要 @Index() 的修饰了
  username: string;

  @Exclude()
  @Column()
  @Length(6, 255, { message: "Must be at least 6 characters long" })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}

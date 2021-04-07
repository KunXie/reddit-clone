import {
  Entity as TOEntity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

import Entity from "./Entity";
import User from "./User";
import Post from "./Post";
@TOEntity("subs")
export default class Sub extends Entity {
  constructor(sub: Partial<Sub>) {
    super();
    Object.assign(this, sub);
  }

  // @Index() // no need to create index here
  @Column({ unique: true })
  name: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrn: string; // just the name, url will be genereated on the fly

  @Column({ nullable: true })
  bannerUrn: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];
}

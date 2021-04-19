import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

import Entity from "./Entity";
import Post from "./Post";
import User from "./User";

import { makeId } from "../util/helpers";
import Vote from "./Vote";
import { Exclude, Expose } from "class-transformer";

@TOEntity("comments")
export default class Comment extends Entity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Column({ unique: true }) // will generate index as well
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  //   @JoinColumn({ name: "id", referencedColumnName: "post" }) // default setting
  post: Post;

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  @Expose() get voteScore(): number {
    return this.votes?.reduce((prev, cur) => prev + (cur.value || 0), 0);
  }

  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeCommentId() {
    this.identifier = makeId(10);
  }
}

import { Migration } from '@mikro-orm/migrations';

export class Migration20210413085749 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "creaated_at" jsonb not null, "updated_at" jsonb not null, "title" varchar(255) not null);');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20210413090106 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "creaated_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');
  }

}

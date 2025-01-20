import { Global, Module } from "@nestjs/common";
import { EnvironmentService } from "./enviroment.service";

@Global()
@Module({

  providers: [EnvironmentService],
  exports: [EnvironmentService]
  
})
export class EnviromentModule {}
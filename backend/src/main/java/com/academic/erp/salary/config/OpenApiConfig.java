package com.academic.erp.salary.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI salaryDisbursementOpenAPI() {
        Server localServer = new Server();
        localServer.setUrl("http://localhost:8080");
        localServer.setDescription("Local Development Server");

        Contact contact = new Contact();
        contact.setName("Academic ERP Team");
        contact.setEmail("support@academicerp.com");

        Info info = new Info()
                .title("Salary Disbursement API")
                .version("1.0.0")
                .description("API documentation for Academic ERP Salary Disbursement Module. " +
                        "This API handles salary management, disbursement, and employee payroll operations.")
                .contact(contact);

        return new OpenAPI()
                .info(info)
                .servers(List.of(localServer));
    }
}

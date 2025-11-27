package com.academic.erp.salary.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Integer employeeId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String email;
    private String title;

    @Column(name = "photograph_path")
    private String photographPath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Department department;
}

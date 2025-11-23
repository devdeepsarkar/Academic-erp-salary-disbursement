package com.academic.erp.salary.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "departments")
public class Department {

    @Id
    @Column(name = "department_id")
    private int departmentId;

    private String name;

    private int capacity;
}

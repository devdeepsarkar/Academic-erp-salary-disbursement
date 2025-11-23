package com.academic.erp.salary.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.sql.Date;

@Entity
@Data
@Table(name = "employee_salary")
public class EmployeeSalary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;     // foreign key

    @Column(name = "payment_date", nullable = false)
    private Date paymentDate;

    private double amount;
    private String description;

    @Enumerated(EnumType.STRING)
    private SalaryStatus status;

    // Employee who disbursed the salary
    @ManyToOne
    @JoinColumn(name = "disbursed_by")
    private Employee disbursedBy;

    private LocalDateTime disbursedAt;

    // Employee who last updated the record
    @ManyToOne
    @JoinColumn(name = "updated_by")
    private Employee updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

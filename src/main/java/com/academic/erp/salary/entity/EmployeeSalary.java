package com.academic.erp.salary.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee_salary")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeSalary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Link to employee (the salary owner)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Employee employee;

    @Column(name = "payment_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate paymentDate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private SalaryStatus status;

    // Employee who disbursed this salary
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disbursed_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Employee disbursedBy;

    @Column(name = "disbursed_at")
    private LocalDateTime disbursedAt;

    // Employee who last updated this row
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Employee updatedBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Ensure defaults before first persist
    @PrePersist
    public void prePersist() {
        if (status == null) {
            status = SalaryStatus.PENDING;
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }
    }
}

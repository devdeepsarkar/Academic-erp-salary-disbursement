package com.academic.erp.salary.controller;

import com.academic.erp.salary.entity.EmployeeSalary;
import com.academic.erp.salary.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salary")
public class SalaryController {

    @Autowired
    private SalaryService salaryService;

    // 1. GET ALL SALARY RECORDS
    @GetMapping("/all")
    public ResponseEntity<List<EmployeeSalary>> getAllSalaries() {
        return ResponseEntity.ok(salaryService.getAllSalaries());
    }

    // 2. GET SALARIES BY EMPLOYEE ID
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmployeeSalary>> getSalaryByEmployee(@PathVariable int employeeId) {
        return ResponseEntity.ok(salaryService.getSalaryByEmployeeId(employeeId));
    }

    // 3. GET ALL PENDING SALARIES
    @GetMapping("/pending")
    public ResponseEntity<List<EmployeeSalary>> getPendingSalaries() {
        return ResponseEntity.ok(salaryService.getPendingSalaries());
    }

    // 4. DISBURSE SINGLE SALARY
    @PutMapping("/disburse/{salaryId}")
    public ResponseEntity<EmployeeSalary> disburseSalary(
            @PathVariable int salaryId,
            @RequestParam int loggedInEmployeeId) {

        return ResponseEntity.ok(
                salaryService.disburseSalary(salaryId, loggedInEmployeeId)
        );
    }

    // 5. BULK DISBURSEMENT
    @PutMapping("/disburse/bulk")
    public ResponseEntity<List<EmployeeSalary>> bulkDisburse(
            @RequestBody List<Integer> salaryIds,
            @RequestParam int loggedInEmployeeId) {

        return ResponseEntity.ok(
                salaryService.bulkDisburse(salaryIds, loggedInEmployeeId)
        );
    }

    // 6. UPDATE SALARY DETAILS (Amount, Date, Description)
    @PutMapping("/update/{salaryId}")
    public ResponseEntity<EmployeeSalary> updateSalary(
            @PathVariable int salaryId,
            @RequestBody EmployeeSalary updatedData,
            @RequestParam int updatedById) {

        return ResponseEntity.ok(
                salaryService.updateSalary(salaryId, updatedData, updatedById)
        );
    }

    // 7. ADD NEW SALARY FOR AN EMPLOYEE
    @PostMapping("/add/{employeeId}")
    public ResponseEntity<EmployeeSalary> addSalary(
            @PathVariable int employeeId,
            @RequestBody EmployeeSalary newSalary,
            @RequestParam int loggedInEmployeeId) {

        return ResponseEntity.ok(
                salaryService.addSalary(employeeId, newSalary, loggedInEmployeeId)
        );
    }

}

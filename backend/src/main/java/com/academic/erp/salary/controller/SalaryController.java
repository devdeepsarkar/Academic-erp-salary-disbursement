
package com.academic.erp.salary.controller;

import com.academic.erp.salary.entity.EmployeeSalary;
import com.academic.erp.salary.helper.EmployeeValidationHelper;
import com.academic.erp.salary.service.SalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salary")
@CrossOrigin(origins = "*")
public class SalaryController {

    @Autowired
    private SalaryService salaryService;

    @Autowired
    private EmployeeValidationHelper validationHelper;

    private void allowOnlyAccounts(int employeeId) {
        validationHelper.validateAccountsEmployee(employeeId);
    }

    @GetMapping("/all")
    public ResponseEntity<List<EmployeeSalary>> getAllSalaries(
            @RequestHeader("X-Employee-Id") int employeeId) {

        allowOnlyAccounts(employeeId);

        return ResponseEntity.ok(salaryService.getAllSalaries());
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmployeeSalary>> getSalaryByEmployee(
            @PathVariable int employeeId,
            @RequestHeader("X-Employee-Id") int loggedInEmployeeId) {

        allowOnlyAccounts(loggedInEmployeeId);

        return ResponseEntity.ok(salaryService.getSalaryByEmployeeId(employeeId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<EmployeeSalary>> getPendingSalaries(
            @RequestHeader("X-Employee-Id") int employeeId) {

        allowOnlyAccounts(employeeId);

        return ResponseEntity.ok(salaryService.getPendingSalaries());
    }

    @PutMapping("/disburse/{salaryId}")
    public ResponseEntity<EmployeeSalary> disburseSalary(
            @PathVariable int salaryId,
            @RequestHeader("X-Employee-Id") int employeeId) {

        allowOnlyAccounts(employeeId);

        return ResponseEntity.ok(salaryService.disburseSalary(salaryId, employeeId));
    }

    @PutMapping("/disburse/bulk")
    public ResponseEntity<List<EmployeeSalary>> bulkDisburse(
            @RequestBody List<Integer> salaryIds,
            @RequestHeader("X-Employee-Id") int employeeId) {

        allowOnlyAccounts(employeeId);

        return ResponseEntity.ok(salaryService.bulkDisburse(salaryIds, employeeId));
    }

    @PutMapping("/update/{salaryId}")
    public ResponseEntity<EmployeeSalary> updateSalary(
            @PathVariable int salaryId,
            @RequestBody EmployeeSalary updatedData,
            @RequestHeader("X-Employee-Id") int employeeId) {

        allowOnlyAccounts(employeeId);

        return ResponseEntity.ok(salaryService.updateSalary(salaryId, updatedData, employeeId));
    }

    @PostMapping("/add/{employeeId}")
    public ResponseEntity<EmployeeSalary> addSalary(
            @PathVariable int employeeId,
            @RequestBody EmployeeSalary newSalary,
            @RequestHeader("X-Employee-Id") int loggedInEmployeeId) {

        allowOnlyAccounts(loggedInEmployeeId);

        return ResponseEntity.ok(salaryService.addSalary(employeeId, newSalary, loggedInEmployeeId));
    }
}

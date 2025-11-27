
package com.academic.erp.salary.controller;

import com.academic.erp.salary.entity.EmployeeSalary;
import com.academic.erp.salary.helper.EmployeeValidationHelper;
import com.academic.erp.salary.service.SalaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salary")
@CrossOrigin(origins = "*")
@Tag(name = "Salary Management", description = "APIs for managing employee salaries and disbursements")
public class SalaryController {

    @Autowired
    private SalaryService salaryService;

    @Autowired
    private EmployeeValidationHelper validationHelper;

    private void allowOnlyAccounts(int employeeId) {
        validationHelper.validateAccountsEmployee(employeeId);
    }

    @Operation(summary = "Get all salaries", description = "Retrieve all salary records (accounts department only)")
    @GetMapping("/all")
    public ResponseEntity<List<EmployeeSalary>> getAllSalaries(
            @Parameter(description = "Employee ID of logged-in user", required = true) @RequestHeader("X-Employee-Id") int employeeId) {

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

    @Operation(summary = "Get pending salaries", description = "Retrieve all pending (not yet disbursed) salary records")
    @GetMapping("/pending")
    public ResponseEntity<List<EmployeeSalary>> getPendingSalaries(
            @Parameter(description = "Employee ID of logged-in user", required = true) @RequestHeader("X-Employee-Id") int employeeId) {

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

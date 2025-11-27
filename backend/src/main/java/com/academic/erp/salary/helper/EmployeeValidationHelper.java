package com.academic.erp.salary.helper;

import com.academic.erp.salary.entity.Employee;
import com.academic.erp.salary.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EmployeeValidationHelper {

    @Autowired
    private EmployeeRepository employeeRepo;

    private static final int ACCOUNTS_DEPARTMENT_ID = 2;

    // Validate if an employee belongs to Accounts Department
    public void validateAccountsEmployee(int employeeId) {

        Employee emp = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + employeeId));

        if (emp.getDepartment().getDepartmentId() != ACCOUNTS_DEPARTMENT_ID) {
            throw new RuntimeException("Access Denied: Only Accounts Department can perform salary operations!");
        }
    }
}

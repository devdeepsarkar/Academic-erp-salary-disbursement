package com.academic.erp.salary.service;

import com.academic.erp.salary.entity.Employee;
import com.academic.erp.salary.entity.EmployeeSalary;
import com.academic.erp.salary.entity.SalaryStatus;
import com.academic.erp.salary.helper.EmployeeValidationHelper;
import com.academic.erp.salary.repository.EmployeeRepository;
import com.academic.erp.salary.repository.EmployeeSalaryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SalaryService {

    @Autowired
    private EmployeeSalaryRepository salaryRepo;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private EmployeeValidationHelper validationHelper;

    // This is used by Controller after extracting token
    public int getEmployeeIdByEmail(String email) {
        Employee emp = employeeRepo.findByEmail(email);
        if (emp == null) {
            throw new RuntimeException("No employee found for email: " + email);
        }
        return emp.getEmployeeId();
    }

    // 1. Get All Salary Records
    public List<EmployeeSalary> getAllSalaries() {
        return salaryRepo.findAll();
    }

    // 2. Get Salaries of a Specific Employee
    public List<EmployeeSalary> getSalaryByEmployeeId(int employeeId) {
        return salaryRepo.findByEmployee_EmployeeId(employeeId);
    }

    // 3. Get All Pending Salaries
    public List<EmployeeSalary> getPendingSalaries() {
        return salaryRepo.findByStatus(SalaryStatus.PENDING);
    }

    // 4. Disburse a Single Salary
    public EmployeeSalary disburseSalary(int salaryId, int loggedInEmployeeId) {

        validationHelper.validateAccountsEmployee(loggedInEmployeeId);

        EmployeeSalary salary = salaryRepo.findById(salaryId)
                .orElseThrow(() -> new RuntimeException("Salary record not found."));

        // Prevent self-disbursement
        if (salary.getEmployee().getEmployeeId() == loggedInEmployeeId) {
            throw new RuntimeException("You cannot disburse your own salary!");
        }

        if (salary.getStatus() != SalaryStatus.PENDING) {
            throw new RuntimeException("Salary already disbursed!");
        }

        salary.setStatus(SalaryStatus.DISBURSED);
        salary.setDisbursedBy(
                employeeRepo.findById(loggedInEmployeeId)
                        .orElseThrow(() -> new RuntimeException("Employee not found!")));
        salary.setDisbursedAt(LocalDateTime.now());

        return salaryRepo.save(salary);
    }

    // 5. Bulk Disbursement
    public List<EmployeeSalary> bulkDisburse(List<Integer> salaryIds, int loggedInEmployeeId) {

        validationHelper.validateAccountsEmployee(loggedInEmployeeId);

        List<EmployeeSalary> result = new ArrayList<>();

        for (int id : salaryIds) {
            EmployeeSalary salary = salaryRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Salary not found: " + id));

            if (salary.getEmployee().getEmployeeId() == loggedInEmployeeId) {
                throw new RuntimeException("Cannot disburse your own salary: " + id);
            }

            if (salary.getStatus() != SalaryStatus.PENDING) {
                throw new RuntimeException("Salary already disbursed: " + id);
            }
        }

        for (int id : salaryIds) {
            result.add(disburseSalary(id, loggedInEmployeeId));
        }

        return result;
    }

    // 6. Update Salary
    public EmployeeSalary updateSalary(int salaryId, EmployeeSalary newData, int updatedById) {

        validationHelper.validateAccountsEmployee(updatedById);

        EmployeeSalary existing = salaryRepo.findById(salaryId)
                .orElseThrow(() -> new RuntimeException("Salary not found!"));

        if (existing.getStatus() == SalaryStatus.DISBURSED) {
            throw new RuntimeException("Cannot modify already disbursed salary!");
        }

        Employee updater = employeeRepo.findById(updatedById)
                .orElseThrow(() -> new RuntimeException("Updater not found!"));

        existing.setAmount(newData.getAmount());
        existing.setDescription(newData.getDescription());
        if (newData.getPaymentDate() != null) {
            existing.setPaymentDate(newData.getPaymentDate());
        }

        existing.setUpdatedBy(updater);
        existing.setUpdatedAt(LocalDateTime.now());

        return salaryRepo.save(existing);
    }

    // 7. Add new Salary for an Employee
    public EmployeeSalary addSalary(int employeeId, EmployeeSalary newSalary, int loggedInEmployeeId) {

        validationHelper.validateAccountsEmployee(loggedInEmployeeId);

        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found: " + employeeId));

        if (employeeId == loggedInEmployeeId) {
            throw new RuntimeException("You cannot add salary to yourself!");
        }

        if (newSalary.getPaymentDate() == null) {
            newSalary.setPaymentDate(LocalDate.now());
        }

        if (salaryRepo.existsByEmployeeEmployeeIdAndPaymentDate(employeeId, newSalary.getPaymentDate())) {
            throw new RuntimeException("Salary already exists for this employee this month!");
        }

        newSalary.setEmployee(employee);
        newSalary.setStatus(SalaryStatus.PENDING);
        newSalary.setUpdatedBy(employeeRepo.findById(loggedInEmployeeId).orElse(null));
        newSalary.setUpdatedAt(LocalDateTime.now());

        return salaryRepo.save(newSalary);
    }

}

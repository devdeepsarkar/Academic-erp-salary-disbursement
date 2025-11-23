package com.academic.erp.salary.service;

import com.academic.erp.salary.entity.Employee;
import com.academic.erp.salary.entity.EmployeeSalary;
import com.academic.erp.salary.entity.SalaryStatus;
import com.academic.erp.salary.repository.EmployeeRepository;
import com.academic.erp.salary.repository.EmployeeSalaryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SalaryService {

    @Autowired
    private EmployeeSalaryRepository salaryRepo;

    @Autowired
    private EmployeeRepository employeeRepo;

    // ================================
    // 1. Get All Salary Records
    // ================================
    public List<EmployeeSalary> getAllSalaries() {
        return salaryRepo.findAll();
    }

    // ================================
    // 2. Get Salaries of a Specific Employee
    // ================================
    public List<EmployeeSalary> getSalaryByEmployeeId(int employeeId) {
        return salaryRepo.findByEmployee_EmployeeId(employeeId);
    }

    // ================================
    // 3. Get All Pending Salaries
    // ================================
    public List<EmployeeSalary> getPendingSalaries() {
        return salaryRepo.findByStatus(SalaryStatus.PENDING);
    }

    // ================================
    // 4. Disburse a Single Salary
    // ================================
    public EmployeeSalary disburseSalary(int salaryId, int loggedInEmployeeId) {

        EmployeeSalary salary = salaryRepo.findById(salaryId)
                .orElseThrow(() -> new RuntimeException("Salary record not found."));

        // Prevent self-disbursement
        if (salary.getEmployee().getEmployeeId() == loggedInEmployeeId) {
            throw new RuntimeException("You cannot disburse your own salary!");
        }

        // Update Salary Status
        salary.setStatus(SalaryStatus.DISBURSED);
        salary.setDisbursedBy(employeeRepo.findById(loggedInEmployeeId).orElse(null));
        salary.setDisbursedAt(LocalDateTime.now());

        return salaryRepo.save(salary);
    }

    // ================================
    // 5. Bulk Disbursement
    // ================================
    public List<EmployeeSalary> bulkDisburse(List<Integer> salaryIds, int loggedInEmployeeId) {
        List<EmployeeSalary> updatedList = new ArrayList<>();

        for (int id : salaryIds) {
            EmployeeSalary salary = disburseSalary(id, loggedInEmployeeId);
            updatedList.add(salary);
        }

        return updatedList;
    }

    // ================================
    // 6. Update Salary Amount / Metadata
    // ================================
    public EmployeeSalary updateSalary(int salaryId, EmployeeSalary newData, int updatedById) {

        EmployeeSalary existing = salaryRepo.findById(salaryId)
                .orElseThrow(() -> new RuntimeException("Salary not found!"));

        if (existing.getStatus() == SalaryStatus.DISBURSED) {
            throw new RuntimeException("Cannot modify salary after disbursement!");
        }

        // Validate updater
        Employee updater = employeeRepo.findById(updatedById)
                .orElseThrow(() -> new RuntimeException("Updater employee not found!"));

        existing.setAmount(newData.getAmount());
        existing.setDescription(newData.getDescription());
        existing.setPaymentDate(newData.getPaymentDate());
        existing.setUpdatedBy(updater);
        existing.setUpdatedAt(LocalDateTime.now());

        return salaryRepo.save(existing);
    }

}

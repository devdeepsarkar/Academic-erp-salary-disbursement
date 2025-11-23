package com.academic.erp.salary.repository;

import com.academic.erp.salary.entity.EmployeeSalary;
import com.academic.erp.salary.entity.SalaryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmployeeSalaryRepository extends JpaRepository<EmployeeSalary, Integer> {

    List<EmployeeSalary> findByEmployee_EmployeeId(int employeeId);

    List<EmployeeSalary> findByStatus(SalaryStatus status);

    List<EmployeeSalary> findByDisbursedBy_EmployeeId(int disbursedBy);
}

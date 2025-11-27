package com.academic.erp.salary.repository;

import com.academic.erp.salary.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    List<Employee> findByDepartment_DepartmentId(int departmentId);

    Employee findByEmail(String email);
}

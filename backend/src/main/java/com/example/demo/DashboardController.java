package com.example.demo;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600) 
public class DashboardController {

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
        }

        String idToken = authHeader.substring(7);

        try {
            FirebaseAuth.getInstance().verifyIdToken(idToken);
            
            // Build Mock Data Matching the Image
            Map<String, Object> response = new HashMap<>();
            
            Map<String, Object> kpis = new HashMap<>();
            kpis.put("orderQuantity", createKpi("2.132", "+2.1%"));
            kpis.put("avgOrderValue", createKpi("$92.10", "+0.2%"));
            kpis.put("impressions", createKpi("13.1K", "+2.1%"));
            response.put("kpis", kpis);
            
            // Mock Sales Analytics Chart Data
            List<Map<String, Object>> chartData = new ArrayList<>();
            int[] sales = {2900, 3900, 2900, 3900, 4800, 5200, 3900, 4200, 3800, 4200, 3900};
            String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"};
            for (int i = 0; i < months.length; i++) {
                Map<String, Object> point = new HashMap<>();
                point.put("name", months[i]);
                point.put("value", sales[i]);
                chartData.add(point);
            }
            response.put("salesAnalytics", chartData);
            
            // Mock Invoices
            List<Map<String, Object>> invoices = new ArrayList<>();
            invoices.add(createInvoice("#065499", "Makima Waifu", "1x Black Backpack", "21/07/2022 08:21", "Paid", "$101"));
            invoices.add(createInvoice("#065499", "Aki Hayakawa", "1x Distro Backpack", "21/07/2022 08:21", "Pending", "$144"));
            invoices.add(createInvoice("#065499", "Denji Chainsaw", "1x New Backpack", "21/07/2022 08:21", "Paid", "$121"));
            response.put("invoices", invoices);

            return ResponseEntity.ok(response);

        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired Firebase token");
        }
    }
    
    private Map<String, Object> createKpi(String value, String change) {
        Map<String, Object> kpi = new HashMap<>();
        kpi.put("value", value);
        kpi.put("change", change);
        return kpi;
    }

    private Map<String, Object> createInvoice(String id, String customerName, String itemsName, String orderDate, String status, String price) {
        Map<String, Object> inv = new HashMap<>();
        inv.put("id", id);
        inv.put("customerName", customerName);
        inv.put("itemsName", itemsName);
        inv.put("orderDate", orderDate);
        inv.put("status", status);
        inv.put("price", price);
        return inv;
    }
}

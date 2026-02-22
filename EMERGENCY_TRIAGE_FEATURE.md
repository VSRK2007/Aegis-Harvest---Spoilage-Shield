# Emergency Triage - Dynamic Rerouting Logic Feature

## Overview
The Emergency Triage algorithm automatically activates when cargo cannot reach its original destination before spoilage occurs. It scans a Secondary Market Database to find the nearest viable "Rescue Point" that can process the food immediately.

## How It Works

### Trigger Condition
Emergency Triage activates automatically when:
- **Remaining_Shelf_Life < Time_to_Destination**
- This happens when:
  1. Chaos Mode (Cooling Failure) is activated AND Days_Left < Travel_Time
  2. User calculates reroute with Days_Left < Travel_Time_Original

### Process Flow

1. **Detection**: System detects that Days_Left < Travel_Time_Original
2. **Database Scan**: Scans Secondary Market Database for rescue points matching the product type
3. **Filtering**: Filters rescue points that:
   - Can be reached before spoilage (Days_Left >= Travel_Time to rescue point)
   - Have capacity < 95%
4. **Optimization**: Sorts by:
   - Highest Survival Margin (Days_Left - Travel_Time)
   - Highest Rescue Value Percentage
5. **Selection**: Chooses best rescue point
6. **Calculation**: Calculates:
   - Rescue Value Recovery %
   - Total Loss Prevented (₹)
   - Original Destination Value (100%)

## UI Display

### Emergency Rescue Card
When Emergency Triage activates, a prominent card displays:

```
🚨 Emergency Triage Activated

Cargo cannot reach Mumbai Premium Supermarket (100% Value)
Rerouting to Local Juice Factory Alpha (Rescue Value: 65%)
Total Loss Prevented: ₹4,50,000
```

### Details Shown:
- **Rescue Value Recovery**: Percentage (e.g., 65%)
- **Rescue Value Amount**: ₹ amount recovered
- **Total Loss Prevented**: ₹ amount saved
- **Rescue Point Details**: Name, Type, Distance, Travel Time
- **Alternative Options**: Top 3 alternative rescue points

## Secondary Market Database

### Product-Specific Rescue Points

Each product has 5 rescue points with different:
- **Types**: Processing Plant, Wholesale Market, Local Market, Storage
- **Rescue Value %**: 50% - 80% (varies by point)
- **Distance**: 15-35 km
- **Travel Time**: 0.5 - 1.2 hours
- **Capacity**: 50% - 95%

### Example Rescue Points (Tomato):
1. **Local Juice Factory Alpha** - 65% Value, 15km, 0.5h
2. **Discount Wholesaler Beta** - 55% Value, 25km, 0.8h
3. **Local Canning Unit Gamma** - 70% Value, 30km, 1.0h
4. **Community Market Delta** - 50% Value, 20km, 0.6h
5. **Food Processing Hub Epsilon** - 75% Value, 35km, 1.2h

## Example Scenario

### Setup:
- **Product**: Tomato
- **Cargo Value**: ₹10,00,000
- **Original Destination**: Mumbai Premium Supermarket
- **Travel Time to Original**: 3 hours
- **Days Left**: 1.5 days (after chaos mode)

### Emergency Triage Activation:
1. System detects: 1.5 days < 3 hours (converted) → FALSE
   - Actually: 1.5 days = 36 hours > 3 hours → Can reach
   
2. **Chaos Mode Example**:
   - Days Left drops to: 0.5 days (12 hours)
   - Travel Time: 3 hours
   - System detects: 0.5 days < 3 hours → TRUE
   - Emergency Triage activates!

3. **Result**:
   - Best Rescue: Local Juice Factory Alpha
   - Rescue Value: 65% = ₹6,50,000
   - Loss Prevented: ₹3,50,000
   - Message: "Cargo cannot reach Mumbai Premium Supermarket (100% Value). Rerouting to Local Juice Factory Alpha (Rescue Value: 65%). Total Loss Prevented: ₹3,50,000."

## Features

✅ **Automatic Triggering**: Activates automatically when conditions are met
✅ **Real-time Calculation**: Updates instantly when chaos mode activates
✅ **Product-Specific**: Different rescue points for each product type
✅ **Visual Alerts**: Prominent UI card with animations
✅ **Multiple Options**: Shows top 3 alternative rescue points
✅ **Value Recovery**: Clear display of rescue value and loss prevented
✅ **Named Destinations**: Uses real destination names (Mumbai, Delhi, etc.)

## Integration

The Emergency Triage feature integrates seamlessly with:
- ✅ Product Selector (different rescue points per product)
- ✅ Chaos Button (auto-triggers when chaos mode activates)
- ✅ Smart Reroute Engine (triggers when calculating reroute)
- ✅ Prediction Card (shows critical status)
- ✅ Telemetry Panel (shows real-time Days_Left)

## API Endpoints

- `POST /api/chaos` - Returns emergency_rescue if triggered
- `POST /api/reroute` - Returns emergency_rescue if Days_Left < Travel_Time
- `GET /api/rescue-points` - Get available rescue points for current product

## Technical Details

### Algorithm Complexity
- Database Scan: O(n) where n = number of rescue points (5 per product)
- Filtering: O(n)
- Sorting: O(n log n)
- **Total**: O(n log n) - Very fast, real-time performance

### Physics-Based Fallback
If ML model not available, uses physics-based calculation:
- Temperature: Exponential decay (doubles every 10°C above 4°C)
- Vibration: 1.5x multiplier if > 0.5G
- Humidity: Linear impact on decay rate

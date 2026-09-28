/**
 * Sample dataset generator for "Brew & Bean Artisan Roasters"
 * Realistic business data containing: Date, Product, Category, Quantity, Sales, Cost, Location, CustomerType
 */

export const SAMPLE_CSV_RAW = `Date,Product,Category,Quantity,Sales,Cost,Location,CustomerType
2026-01-05,Signature Espresso Blend,Coffee Beans,12,288.00,108.00,Downtown Flagship,Retail
2026-01-06,Cold Brew Bottle (Pack of 4),Ready-to-Drink,18,324.00,144.00,Westside Mall,Regular
2026-01-07,Single Origin Ethiopia 1kg,Coffee Beans,8,256.00,112.00,Downtown Flagship,Member
2026-01-08,Artisan Almond Croissant,Bakery & Snacks,25,125.00,50.00,Downtown Flagship,Retail
2026-01-09,Ceramic Travel Tumbler,Merchandise,5,140.00,60.00,Westside Mall,Retail
2026-01-10,Organic Oat Milk Latte,Beverages,42,273.00,105.00,Downtown Flagship,Regular
2026-01-11,Vanilla Bean Syrup 750ml,Add-ons,9,117.00,45.00,Uptown Kiosk,Retail
2026-01-12,Signature Espresso Blend,Coffee Beans,24,576.00,216.00,Westside Mall,Wholesale B2B
2026-01-13,Cold Brew Bottle (Pack of 4),Ready-to-Drink,14,252.00,112.00,Downtown Flagship,Regular
2026-01-14,Matcha Green Tea Tin,Specialty Tea,7,126.00,56.00,Airport Terminal,Member
2026-01-15,Dark Chocolate Brownie,Bakery & Snacks,30,120.00,45.00,Airport Terminal,Retail
2026-01-16,Colombian Supremo 1kg,Coffee Beans,15,420.00,180.00,Downtown Flagship,Wholesale B2B
2026-01-17,Organic Oat Milk Latte,Beverages,55,357.50,137.50,Downtown Flagship,Regular
2026-01-18,Ceramic Pour-Over Dripper,Merchandise,4,136.00,56.00,Westside Mall,Member
2026-01-19,Cold Brew Bottle (Pack of 4),Ready-to-Drink,22,396.00,176.00,Airport Terminal,Retail
2026-01-20,Single Origin Ethiopia 1kg,Coffee Beans,10,320.00,140.00,Westside Mall,Member
2026-01-21,Caramel Macchiato,Beverages,38,247.00,95.00,Uptown Kiosk,Retail
2026-01-22,Artisan Almond Croissant,Bakery & Snacks,28,140.00,56.00,Downtown Flagship,Regular
2026-01-23,Signature Espresso Blend,Coffee Beans,35,840.00,315.00,Airport Terminal,Wholesale B2B
2026-01-24,Organic Oat Milk Latte,Beverages,60,390.00,150.00,Downtown Flagship,Regular
2026-01-25,Cold Brew Bottle (Pack of 4),Ready-to-Drink,16,288.00,128.00,Uptown Kiosk,Retail
2026-01-26,Vanilla Bean Syrup 750ml,Add-ons,8,104.00,40.00,Downtown Flagship,Member
2026-01-27,Decaf Swiss Water 1kg,Coffee Beans,6,180.00,84.00,Westside Mall,Retail
2026-01-28,Matcha Green Tea Tin,Specialty Tea,9,162.00,72.00,Downtown Flagship,Regular
2026-01-29,Artisan Almond Croissant,Bakery & Snacks,32,160.00,64.00,Airport Terminal,Retail
2026-01-30,Ceramic Travel Tumbler,Merchandise,6,168.00,72.00,Downtown Flagship,Member
2026-02-01,Signature Espresso Blend,Coffee Beans,18,432.00,162.00,Downtown Flagship,Regular
2026-02-02,Organic Oat Milk Latte,Beverages,50,325.00,125.00,Downtown Flagship,Retail
2026-02-03,Cold Brew Bottle (Pack of 4),Ready-to-Drink,25,450.00,200.00,Westside Mall,Regular
2026-02-04,Colombian Supremo 1kg,Coffee Beans,12,336.00,144.00,Downtown Flagship,Member
2026-02-05,Dark Chocolate Brownie,Bakery & Snacks,35,140.00,52.50,Uptown Kiosk,Retail
2026-02-06,Signature Espresso Blend,Coffee Beans,40,960.00,360.00,Airport Terminal,Wholesale B2B
2026-02-07,Caramel Macchiato,Beverages,44,286.00,110.00,Downtown Flagship,Regular
2026-02-08,Ceramic Pour-Over Dripper,Merchandise,3,102.00,42.00,Downtown Flagship,Member
2026-02-09,Single Origin Ethiopia 1kg,Coffee Beans,14,448.00,196.00,Westside Mall,Regular
2026-02-10,Vanilla Bean Syrup 750ml,Add-ons,11,143.00,55.00,Airport Terminal,Retail
2026-02-11,Organic Oat Milk Latte,Beverages,64,416.00,160.00,Downtown Flagship,Regular
2026-02-12,Cold Brew Bottle (Pack of 4),Ready-to-Drink,30,540.00,240.00,Downtown Flagship,Regular
2026-02-13,Artisan Almond Croissant,Bakery & Snacks,40,200.00,80.00,Downtown Flagship,Member
2026-02-14,Signature Espresso Blend,Coffee Beans,55,1320.00,495.00,Downtown Flagship,Wholesale B2B
2026-02-15,Organic Oat Milk Latte,Beverages,72,468.00,180.00,Airport Terminal,Regular
2026-02-16,Matcha Green Tea Tin,Specialty Tea,12,216.00,96.00,Westside Mall,Retail
2026-02-17,Decaf Swiss Water 1kg,Coffee Beans,5,150.00,70.00,Uptown Kiosk,Retail
2026-02-18,Ceramic Travel Tumbler,Merchandise,8,224.00,96.00,Downtown Flagship,Member
2026-02-19,Caramel Macchiato,Beverages,36,234.00,90.00,Westside Mall,Retail
2026-02-20,Cold Brew Bottle (Pack of 4),Ready-to-Drink,19,342.00,152.00,Airport Terminal,Regular
2026-02-21,Signature Espresso Blend,Coffee Beans,20,480.00,180.00,Westside Mall,Retail
2026-02-22,Dark Chocolate Brownie,Bakery & Snacks,26,104.00,39.00,Downtown Flagship,Retail
2026-02-23,Colombian Supremo 1kg,Coffee Beans,16,448.00,192.00,Airport Terminal,Member
2026-02-24,Organic Oat Milk Latte,Beverages,58,377.00,145.00,Downtown Flagship,Regular
2026-02-25,Single Origin Ethiopia 1kg,Coffee Beans,11,352.00,154.00,Downtown Flagship,Retail
2026-02-26,Vanilla Bean Syrup 750ml,Add-ons,7,91.00,35.00,Westside Mall,Member
2026-02-27,Artisan Almond Croissant,Bakery & Snacks,34,170.00,68.00,Uptown Kiosk,Retail
2026-02-28,Cold Brew Bottle (Pack of 4),Ready-to-Drink,28,504.00,224.00,Downtown Flagship,Regular
2026-03-01,Signature Espresso Blend,Coffee Beans,26,624.00,234.00,Downtown Flagship,Regular
2026-03-02,Organic Oat Milk Latte,Beverages,68,442.00,170.00,Downtown Flagship,Regular
2026-03-03,Cold Brew Bottle (Pack of 4),Ready-to-Drink,24,432.00,192.00,Westside Mall,Retail
2026-03-04,Ceramic Pour-Over Dripper,Merchandise,5,170.00,70.00,Airport Terminal,Member
2026-03-05,Dark Chocolate Brownie,Bakery & Snacks,42,168.00,63.00,Downtown Flagship,Retail
2026-03-06,Signature Espresso Blend,Coffee Beans,48,1152.00,432.00,Westside Mall,Wholesale B2B
2026-03-07,Single Origin Ethiopia 1kg,Coffee Beans,15,480.00,210.00,Airport Terminal,Member
2026-03-08,Caramel Macchiato,Beverages,46,299.00,115.00,Downtown Flagship,Regular
2026-03-09,Matcha Green Tea Tin,Specialty Tea,10,180.00,80.00,Downtown Flagship,Retail
2026-03-10,Colombian Supremo 1kg,Coffee Beans,18,504.00,216.00,Downtown Flagship,Regular
2026-03-11,Artisan Almond Croissant,Bakery & Snacks,36,180.00,72.00,Westside Mall,Member
2026-03-12,Ceramic Travel Tumbler,Merchandise,9,252.00,108.00,Downtown Flagship,Retail
2026-03-13,Organic Oat Milk Latte,Beverages,75,487.50,187.50,Downtown Flagship,Regular
2026-03-14,Cold Brew Bottle (Pack of 4),Ready-to-Drink,32,576.00,256.00,Airport Terminal,Retail
2026-03-15,Signature Espresso Blend,Coffee Beans,52,1248.00,468.00,Downtown Flagship,Wholesale B2B
2026-03-16,Vanilla Bean Syrup 750ml,Add-ons,14,182.00,70.00,Uptown Kiosk,Retail
2026-03-17,Decaf Swiss Water 1kg,Coffee Beans,8,240.00,112.00,Westside Mall,Regular
2026-03-18,Artisan Almond Croissant,Bakery & Snacks,38,190.00,76.00,Downtown Flagship,Retail
2026-03-19,Caramel Macchiato,Beverages,50,325.00,125.00,Airport Terminal,Regular
2026-03-20,Organic Oat Milk Latte,Beverages,82,533.00,205.00,Downtown Flagship,Regular
2026-03-21,Cold Brew Bottle (Pack of 4),Ready-to-Drink,35,630.00,280.00,Downtown Flagship,Regular
2026-03-22,Single Origin Ethiopia 1kg,Coffee Beans,19,608.00,266.00,Westside Mall,Member
2026-03-23,Dark Chocolate Brownie,Bakery & Snacks,45,180.00,67.50,Downtown Flagship,Retail
2026-03-24,Signature Espresso Blend,Coffee Beans,30,720.00,270.00,Airport Terminal,Retail
2026-03-25,Colombian Supremo 1kg,Coffee Beans,14,392.00,168.00,Downtown Flagship,Wholesale B2B
2026-03-26,Ceramic Pour-Over Dripper,Merchandise,7,238.00,98.00,Westside Mall,Member
2026-03-27,Matcha Green Tea Tin,Specialty Tea,15,270.00,120.00,Downtown Flagship,Regular
2026-03-28,Organic Oat Milk Latte,Beverages,90,585.00,225.00,Downtown Flagship,Regular
2026-03-29,Vanilla Bean Syrup 750ml,Add-ons,12,156.00,60.00,Airport Terminal,Retail
2026-03-30,Cold Brew Bottle (Pack of 4),Ready-to-Drink,40,720.00,320.00,Downtown Flagship,Wholesale B2B
2026-03-31,Artisan Almond Croissant,Bakery & Snacks,48,240.00,96.00,Downtown Flagship,Retail
2026-04-02,Signature Espresso Blend,Coffee Beans,32,768.00,288.00,Downtown Flagship,Regular
2026-04-04,Cold Brew Bottle (Pack of 4),Ready-to-Drink,44,792.00,352.00,Westside Mall,Regular
2026-04-06,Organic Oat Milk Latte,Beverages,86,559.00,215.00,Downtown Flagship,Regular
2026-04-08,Single Origin Ethiopia 1kg,Coffee Beans,16,512.00,224.00,Downtown Flagship,Member
2026-04-10,Dark Chocolate Brownie,Bakery & Snacks,50,200.00,75.00,Airport Terminal,Retail
2026-04-12,Signature Espresso Blend,Coffee Beans,65,1560.00,585.00,Downtown Flagship,Wholesale B2B
2026-04-14,Caramel Macchiato,Beverages,52,338.00,130.00,Westside Mall,Regular
2026-04-16,Ceramic Travel Tumbler,Merchandise,10,280.00,120.00,Downtown Flagship,Retail
2026-04-18,Colombian Supremo 1kg,Coffee Beans,22,616.00,264.00,Downtown Flagship,Member
2026-04-20,Matcha Green Tea Tin,Specialty Tea,14,252.00,112.00,Airport Terminal,Retail
2026-04-22,Organic Oat Milk Latte,Beverages,95,617.50,237.50,Downtown Flagship,Regular
2026-04-24,Cold Brew Bottle (Pack of 4),Ready-to-Drink,52,936.00,416.00,Downtown Flagship,Regular
2026-04-26,Artisan Almond Croissant,Bakery & Snacks,55,275.00,110.00,Downtown Flagship,Retail
2026-04-28,Decaf Swiss Water 1kg,Coffee Beans,9,270.00,126.00,Uptown Kiosk,Member
2026-04-30,Signature Espresso Blend,Coffee Beans,38,912.00,342.00,Westside Mall,Regular
2026-05-02,Cold Brew Bottle (Pack of 4),Ready-to-Drink,60,1080.00,480.00,Downtown Flagship,Wholesale B2B
2026-05-05,Organic Oat Milk Latte,Beverages,110,715.00,275.00,Downtown Flagship,Regular
2026-05-08,Single Origin Ethiopia 1kg,Coffee Beans,18,576.00,252.00,Westside Mall,Retail
2026-05-11,Dark Chocolate Brownie,Bakery & Snacks,48,192.00,72.00,Downtown Flagship,Retail
2026-05-14,Signature Espresso Blend,Coffee Beans,70,1680.00,630.00,Downtown Flagship,Wholesale B2B
2026-05-17,Vanilla Bean Syrup 750ml,Add-ons,18,234.00,90.00,Downtown Flagship,Member
2026-05-20,Caramel Macchiato,Beverages,62,403.00,155.00,Airport Terminal,Regular
2026-05-23,Ceramic Pour-Over Dripper,Merchandise,6,204.00,84.00,Westside Mall,Retail
2026-05-26,Organic Oat Milk Latte,Beverages,105,682.50,262.50,Downtown Flagship,Regular
2026-05-29,Cold Brew Bottle (Pack of 4),Ready-to-Drink,58,1044.00,464.00,Westside Mall,Regular
2026-06-02,Signature Espresso Blend,Coffee Beans,42,1008.00,378.00,Airport Terminal,Wholesale B2B
2026-06-06,Colombian Supremo 1kg,Coffee Beans,25,700.00,300.00,Downtown Flagship,Member
2026-06-10,Matcha Green Tea Tin,Specialty Tea,16,288.00,128.00,Downtown Flagship,Retail
2026-06-14,Artisan Almond Croissant,Bakery & Snacks,60,300.00,120.00,Westside Mall,Regular
2026-06-18,Ceramic Travel Tumbler,Merchandise,12,336.00,144.00,Downtown Flagship,Retail
2026-06-22,Organic Oat Milk Latte,Beverages,118,767.00,295.00,Downtown Flagship,Regular
2026-06-26,Cold Brew Bottle (Pack of 4),Ready-to-Drink,65,1170.00,520.00,Downtown Flagship,Regular
2026-06-30,Signature Espresso Blend,Coffee Beans,75,1800.00,675.00,Downtown Flagship,Wholesale B2B
2026-07-04,Organic Oat Milk Latte,Beverages,125,812.50,312.50,Downtown Flagship,Retail
2026-07-08,Cold Brew Bottle (Pack of 4),Ready-to-Drink,72,1296.00,576.00,Westside Mall,Regular
2026-07-12,Single Origin Ethiopia 1kg,Coffee Beans,20,640.00,280.00,Airport Terminal,Member
2026-07-16,Artisan Almond Croissant,Bakery & Snacks,65,325.00,130.00,Downtown Flagship,Regular
2026-07-20,Signature Espresso Blend,Coffee Beans,80,1920.00,720.00,Downtown Flagship,Wholesale B2B
2026-07-24,Caramel Macchiato,Beverages,68,442.00,170.00,Downtown Flagship,Retail
2026-07-28,Dark Chocolate Brownie,Bakery & Snacks,55,220.00,82.50,Westside Mall,Regular
2026-08-03,Cold Brew Bottle (Pack of 4),Ready-to-Drink,78,1404.00,624.00,Downtown Flagship,Regular
2026-08-08,Organic Oat Milk Latte,Beverages,130,845.00,325.00,Downtown Flagship,Regular
2026-08-12,Signature Espresso Blend,Coffee Beans,85,2040.00,765.00,Downtown Flagship,Wholesale B2B
2026-08-16,Colombian Supremo 1kg,Coffee Beans,28,784.00,336.00,Westside Mall,Member
2026-08-20,Decaf Swiss Water 1kg,Coffee Beans,10,300.00,140.00,Uptown Kiosk,Retail
2026-08-24,Artisan Almond Croissant,Bakery & Snacks,70,350.00,140.00,Airport Terminal,Regular
2026-08-28,Ceramic Pour-Over Dripper,Merchandise,8,272.00,112.00,Downtown Flagship,Retail
2026-09-02,Cold Brew Bottle (Pack of 4),Ready-to-Drink,68,1224.00,544.00,Westside Mall,Regular
2026-09-07,Signature Espresso Blend,Coffee Beans,88,2112.00,792.00,Downtown Flagship,Wholesale B2B
2026-09-12,Organic Oat Milk Latte,Beverages,135,877.50,337.50,Downtown Flagship,Regular
2026-09-16,Single Origin Ethiopia 1kg,Coffee Beans,22,704.00,308.00,Downtown Flagship,Member
2026-09-20,Matcha Green Tea Tin,Specialty Tea,18,324.00,144.00,Westside Mall,Retail
2026-09-25,Caramel Macchiato,Beverages,74,481.00,185.00,Downtown Flagship,Regular`;

//get dashboard data for seller(total orders, total earnings, total products, ratings)

import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";

export async function GET (request){
    try{
        //authenticate seller
        const { userId } = getAuth(request);
        const {storeId}= await authSeller(userId);

        const orders = await prisma.order.findMany({
            where: { storeId },
        });

        const products = await prisma.product.findMany({
            where: { storeId }
        });

        const ratings = await prisma.rating.findMany({
            where: { productId:{in:products.map(product=>product.id)}},
            include:{user:true,product:true}
        });

        const totalSales = orders.reduce((total, order) => total + order.totalAmount, 0);
        const totalOrders = orders.length;
        const totalProducts = products.length;

        const dashboardData = {
            ratings,
            totalOrders:orders.length,
            totalEarnings:Math.round(orders.reduce((acc,order)=>acc+order.total,0)),
            totalProducts:products.length,
           
        };

        return NextResponse.json({ dashboardData });

    }
    catch(error){
       console.error( error);
       return NextResponse.json({error: error.code || error.message}, { status: 400 });
     
     }
}
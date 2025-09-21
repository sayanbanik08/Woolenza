import React from 'react';
import Link from 'next/link';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';

const SideBar = () => {
    const pathname = usePathname()
    const { navigateWithLoading } = useAppContext()
    const menuItems = [
        { name: 'Add Product', path: '/seller', icon: assets.add_icon },
        { name: 'Product List', path: '/seller/product-list', icon: assets.product_list_icon },
        { name: 'Orders', path: '/seller/orders', icon: assets.order_icon },
        { name: 'Control', path: '/seller/control', icon: assets.user_icon },
    ];

    return (
        <div className='md:w-64 w-16 flex-shrink-0 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col'>
            {menuItems.map((item) => {

                const isActive = pathname === item.path;

                return (
                    <div key={item.name}>
                        <div
                            onClick={() => navigateWithLoading(item.path)}
                            className={
                                `flex items-center py-3 px-4 gap-3 cursor-pointer ${isActive
                                    ? "border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90"
                                    : "hover:bg-gray-100/90 border-white"
                                }`
                            }
                        >
                            <Image
                                src={item.icon}
                                alt={`${item.name.toLowerCase()}_icon`}
                                className="w-8 h-8"
                            />
                            <p className='md:block hidden text-center'>{item.name}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SideBar;

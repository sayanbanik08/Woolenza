'use client'
import React from 'react'
import { useAppContext } from '@/context/AppContext'

const LoadingOverlay = () => {
    const { isLoading } = useAppContext()

    if (!isLoading) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-orange-500"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-pulse border-t-orange-300"></div>
            </div>
        </div>
    )
}

export default LoadingOverlay
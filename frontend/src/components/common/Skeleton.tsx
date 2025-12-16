import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', width, height, style }) => {
    const styles: React.CSSProperties = {
        width: width,
        height: height,
        ...style,
    };

    return <div className={`skeleton ${className}`} style={styles} />;
};

export default Skeleton;

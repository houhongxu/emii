import { MutableRefObject, PropsWithChildren, ReactNode } from 'react';
import { FunctionComponent } from 'react';
interface KeepAliveLayoutProps {
    /**
     * 匹配路径的数组
     */
    keepalivePaths: (string | RegExp)[];
}
interface KeepAliveProps extends KeepAliveLayoutProps {
    /**
     * keepalive中的react组件
     */
    keepaliveElementsRef: MutableRefObject<Record<string, ReactNode>>;
    /**
     * 通过路径移除keepalive的react组件
     */
    dropByPath: (path: string) => void;
}
declare const KeepAliveContext: import("react").Context<KeepAliveProps>;
/**
 * 为子组件提供KeepAliveContext
 */
declare const KeepAliveLayout: FunctionComponent<PropsWithChildren<KeepAliveLayoutProps>>;
/**
 * 获取keepalive后的react组件
 */
declare const useKeepaliveOutlets: () => import("react/jsx-runtime").JSX.Element;
export { KeepAliveLayout, useKeepaliveOutlets, KeepAliveContext };

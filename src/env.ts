declare global {
    interface Window {
        env: any
    }
}

type EnvType = {
    REACT_APP_ENDPOINT: string,
}
export const env: EnvType = { ...process.env, ...window.env }
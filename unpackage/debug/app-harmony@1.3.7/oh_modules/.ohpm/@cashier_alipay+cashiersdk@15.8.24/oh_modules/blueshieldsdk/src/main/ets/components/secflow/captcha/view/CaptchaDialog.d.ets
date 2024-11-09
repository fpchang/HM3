@Entry({ routeName: 'CaptchaDialogCaller' })
@Component
export declare struct CaptchaDialogCaller {
    @State
    customUIElement: string | null;
    private lastWindow;
    private dialogController;
    aboutToAppear(): void;
    aboutToDisappear(): void;
    exitDialog(): void;
    build(): void;
}

#import "AppDelegate.h"
#import "RNBootSplash.h"

#import <Firebase.h>

#import <React/RCTBundleURLProvider.h>
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#if DEBUG
  FIRAppCheckDebugProviderFactory *providerFactory =
        [[FIRAppCheckDebugProviderFactory alloc] init];
  [FIRAppCheck setAppCheckProviderFactory:providerFactory];
#endif

  [FIRApp configure];

  self.moduleName = @"Couleurbummel";
  // Required since React Native 0.77: the dependency provider wires up the
  // view-manager/TurboModule interop. Without it, native view managers are
  // not registered correctly and props crash with e.g.
  // `-[RCTView setSheetLargestUndimmedDetent:]: unrecognized selector`.
  self.dependencyProvider = [[RCTAppDependencyProvider alloc] init];
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  BOOL result = [super application:application didFinishLaunchingWithOptions:launchOptions];

  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:self.window.rootViewController.view];

  return result;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end

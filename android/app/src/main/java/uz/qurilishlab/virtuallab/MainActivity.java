package uz.qurilishlab.virtuallab;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

/**
 * Qurilish materiallari virtual laboratoriyasi — Android qobig'i.
 * static/ papkasidagi veb-ilova APK ichidan, internetsiz ochiladi.
 */
public class MainActivity extends Activity {

    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/assets/index.html";

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);                 // localStorage: jurnal va talaba ismi
        s.setMediaPlaybackRequiresUserGesture(false); // Web Audio ovozlari
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (HOST.equals(uri.getHost())) return false;
                // Tashqi havolalar (manbalar ro'yxati) tizim brauzerida ochiladi
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (ActivityNotFoundException ignored) {
                }
                return true;
            }
        });

        webView.addJavascriptInterface(new Bridge(), "AndroidApp");

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(START_URL);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) webView.destroy();
        super.onDestroy();
    }

    /** JS -> Android: hisobotni chop etish / PDF ga saqlash */
    private class Bridge {
        @JavascriptInterface
        public void print() {
            runOnUiThread(MainActivity.this::printPage);
        }
    }

    private void printPage() {
        PrintManager pm = (PrintManager) getSystemService(Context.PRINT_SERVICE);
        if (pm == null) {
            clearPrintingClass();
            return;
        }
        final PrintDocumentAdapter inner = webView.createPrintDocumentAdapter("QurilishLab hisobot");
        // Chop etish oynasi yopilganda sahifadagi 'printing' holatini olib tashlaymiz
        PrintDocumentAdapter adapter = new PrintDocumentAdapter() {
            @Override
            public void onStart() { inner.onStart(); }

            @Override
            public void onLayout(PrintAttributes oldA, PrintAttributes newA, CancellationSignal c,
                                 LayoutResultCallback cb, Bundle extras) {
                inner.onLayout(oldA, newA, c, cb, extras);
            }

            @Override
            public void onWrite(PageRange[] pages, ParcelFileDescriptor dest, CancellationSignal c,
                                WriteResultCallback cb) {
                inner.onWrite(pages, dest, c, cb);
            }

            @Override
            public void onFinish() {
                inner.onFinish();
                clearPrintingClass();
            }
        };
        pm.print("QurilishLab hisobot", adapter, new PrintAttributes.Builder()
                .setMediaSize(PrintAttributes.MediaSize.ISO_A4).build());
    }

    private void clearPrintingClass() {
        webView.evaluateJavascript("document.body.classList.remove('printing')", null);
    }
}

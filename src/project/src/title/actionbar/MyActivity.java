package title.actionbar;

import android.os.Bundle;
import com.polyvi.smartcmty.R;

public class MyActivity extends NavUpActionBarActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_my);
    }

    @Override
    protected int getCustomTitleResId() {
        return R.string.title_activity_my;
    }

    @Override
    protected String getCustomTitle() {
        return getResources().getString(R.string.title_activity_my);
    }
}

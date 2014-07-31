package title.actionbar;

import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;

import com.polyvi.smartcmty.R;

public abstract class NavUpActionBarActivity extends ActionBarActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        ActionBar actionBar = getSupportActionBar();

        actionBar.setHomeAsUpIndicator(R.drawable.action_bar_back);
        actionBar.setTitle(getCustomTitle());

        // setDisplayOptions didn't show any actionbar
        actionBar.setDisplayOptions(
            ActionBar.DISPLAY_SHOW_TITLE | ActionBar.DISPLAY_HOME_AS_UP);


        // uncomment below, will show an fullscreen actionbar
        //actionBar.setDisplayShowTitleEnabled(true);
        //actionBar.setDisplayHomeAsUpEnabled(true);
    }

    @Override
    public boolean onSupportNavigateUp () {
        this.finish();
        return true;
    }

    protected abstract int getCustomTitleResId();

    protected abstract String getCustomTitle();
}

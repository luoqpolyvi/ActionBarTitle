package title.actionbar;

import android.support.v4.view.MenuItemCompat;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import com.polyvi.smartcmty.R;

public abstract class BackAddActionBarActivity extends NavUpActionBarActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.back_add_action_bar, menu);
        MenuItem menuItem = menu.findItem(R.id.action_new);
        MenuItemCompat.setShowAsAction(menuItem, MenuItemCompat.SHOW_AS_ACTION_ALWAYS);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_new) {
            onActionNew();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    protected void onActionNew() {

    }
}
